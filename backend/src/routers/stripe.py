import os
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
from backend.src.models.database import get_db, User
from backend.src.auth import get_api_key_from_state
from sqlalchemy.orm import Session

# Initialize your Stripe API with your secret key
stripe.api_key = os.getenv("STRIPE_SECRET_TEST_KEY")

router = APIRouter()

@router.post("/create-payment-intent")
async def create_payment_intent(request: Request, db: Session = Depends(get_db)):
    try:
        # Extract user's API key from the request and find the user in the database
        api_key = get_api_key_from_state(request)
        user = db.query(User).filter(User.api_key == api_key).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        data = await request.json()
        amount = data.get('amount')

        # Create a Stripe Checkout Session with the user's email in the metadata
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Tokens',
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            metadata={'user_email': user.email},  # Include user's email in metadata
            mode='payment',
        )

        return JSONResponse({"sessionId": session.id})

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

        # Find the user based on user_id extracted from metadata
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"User with ID {user_id} not found.")
            return JSONResponse(content={"success": False, "message": "User not found"}, status_code=status.HTTP_404_NOT_FOUND)

        # Logic to update user's balance
        # Assuming you have a function or logic to calculate the tokens based on amount paid
        # For simplicity, let's say 1 USD = 100 tokens
        amount_paid = payment_intent['amount_received']  # amount_received is in cents
        new_tokens = amount_paid / 100  # Convert to dollars and assume each dollar buys 100 tokens

        user.balance += new_tokens
        db.add(user)
        db.commit()
        print(f"Updated user {user_id} balance with {new_tokens} tokens.")

        return JSONResponse(content={"success": True, "message": "User balance updated"})

    print('Unhandled event type {}'.format(event['type']))
    return JSONResponse(content={"success": True, "message": "Unhandled event type"})
