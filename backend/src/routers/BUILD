package(default_visibility=["//visibility:public"])

load("@rules_python//python:defs.bzl", "py_binary")
load("@python_deps//:requirements.bzl", "requirement")

py_library(
    name = "routers",
    srcs = ["__init__.py",
            "index.py",
            "bets.py",
            "users.py",
            "verifiers.py",
            "stripe.py"],
    deps = [requirement("fastapi"),
        requirement("pydantic"),
        requirement("psycopg2-binary"),
        requirement("authlib"), 
        requirement("httpx"), 
        requirement("itsdangerous"),
        requirement("stripe"),
        "//interfaces:bets_proto_py",
        "//backend/src/models",
        "//backend/src:auth"]
)

py_test(
    name = "test_index",
    srcs = ["test_index.py"],
    deps = [
        requirement("fastapi"),
        requirement("pydantic"),
        requirement("httpx"),
        requirement("pytest"),
        requirement("authlib"),  
        requirement("itsdangerous"),
        "//backend:main"
    ]
)