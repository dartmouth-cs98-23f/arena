import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import stripe

# Initialize your Stripe API with your secret key
stripe.api_key = os.getenv("STRIPE_SECRET_TEST_KEY")

router = APIRouter()

@router.post("/create-payment-intent")
async def create_payment_intent(request: Request):
    try:
        data = await request.json()
        # Ensure price is provided in the smallest currency unit (e.g., cents for USD)
        amount = data.get('amount')  # Assuming `amount` is already in cents

        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            # You can add more Stripe parameters here as needed
        )
        return JSONResponse({"clientSecret": payment_intent.client_secret})
    except Exception as e:
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


