import os
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
from backend.src.models.database import get_db, User, get_user_from_uuid
from backend.src.auth import get_api_key_from_state
from sqlalchemy.orm import Session

# Initialize your Stripe API with your secret key
stripe.api_key = os.getenv("STRIPE_SECRET_TEST_KEY")
endpoint_secret = os.getenv("ENDPOINT_SECRET")

price_to_tokens_map = {
    99: 100,    # $0.99 for 100 tokens
    499: 500,   # $4.99 for 500 tokens
    999: 1200,  # $9.99 for 1200 tokens
    4999: 6500, # $49.99 for 6500 tokens
}

router = APIRouter()
@router.post("/create-payment-intent")
async def create_payment_intent(request: Request, db: Session = Depends(get_db)):
    try:
        api_key = await get_api_key_from_state(request)
        user = get_user_from_uuid(api_key, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        data = await request.json()
        amount = data.get('amount')
        if not amount:
            raise HTTPException(status_code=400, detail="Amount is required")

        # Create a Payment Intent instead of a Checkout Session
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            metadata={'user_id': str(user.id)},
        )

        return JSONResponse({"clientSecret": payment_intent.client_secret})
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/webhook')
async def webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid payload') from e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid signature') from e

    # Process successful payment intents
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        user_id = payment_intent['metadata'].get('user_id')
        amount_received = payment_intent['amount_received']
        print(f"User ID from metadata: {user_id}, Amount received: {amount_received}")

        # Find the user based on user_id extracted from metadata
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"User with ID {user_id} not found.")
            return JSONResponse(content={"success": False, "message": "User not found"}, status_code=status.HTTP_404_NOT_FOUND)

        # Logic to update user's balance
        # Assuming you have a function or logic to calculate the tokens based on amount paid
        # For simplicity, let's say 1 USD = 100 tokens
        print(f"Current balance before update: {user.balance}")
        amount_received = payment_intent['amount_received']  # amount_received is in cents
        new_tokens = price_to_tokens_map.get(amount_received // 100 * 100, 0) # Convert to dollars, find nearest key or default to 0
        print(f"New balance after update: {user.balance}")

        user.balance += new_tokens
        db.add(user)
        db.commit()
        print(f"Updated user {user_id} balance with {new_tokens} tokens.")

        return JSONResponse(content={"success": True, "message": "User balance updated"})

    print('Unhandled event type {}'.format(event['type']))
    return JSONResponse(content={"success": True, "message": "Unhandled event type"})