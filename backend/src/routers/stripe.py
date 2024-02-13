import os
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
from .models.database import get_db, User
from .auth import get_api_key_from_request

# Initialize your Stripe API with your secret key
stripe.api_key = os.getenv("STRIPE_SECRET_TEST_KEY")

router = APIRouter()

@router.post("/create-payment-intent")
async def create_payment_intent(request: Request, db: Session = Depends(get_db)):
    try:
        # Extract user's API key from the request and find the user in the database
        api_key = get_api_key_from_request(request)
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
    


@app.post('/webhook')
async def webhook(request: Request):
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

    # Handle the event
    print('Unhandled event type {}'.format(event['type']))

    return JSONResponse(content={"success": True})


