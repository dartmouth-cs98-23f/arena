#!/usr/bin/env python3

"""
add_api_key.py
Adds additional API keys interactively.

To use, run this as a module python3 -m src.add_api_key and follow interactive
instructions. All keys require a nickname.
"""

import secrets
import datetime

from backend.src.models.database import Base, SessionLocal, engine, Key, User

if __name__ == "__main__":
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    firstname = input("first name>")
    lastname = input("last name>")
    email = input("email >")
    google_id = "None"

    key = secrets.token_urlsafe(24)
    user = User(
        first_name = firstname,
        last_name = lastname,
        email = email,
        google_id = google_id,
        api_token = key,
    )

    db.add(user)
    db.commit()

    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("CANNOT FIND USER, COULDN'T INSERT")
        exit(1)
    print("Found USER ID: ", str(user.id))

    keyname = input("Enter the name of the key: ")
    print(f"Key generated: {key}")

    record = Key(
                name=keyname,
                key=key,
                created=datetime.datetime.now(),
                user_id = user.id)

    print(record)

    db.add(record)
    db.commit()
    db.close()

