package(default_visibility=["//visibility:public"])

load("@rules_python//python:defs.bzl", "py_binary")
load("@python_deps//:requirements.bzl", "requirement")

py_binary(
    name = "main",
    srcs = ["//backend/src:main.py"],
    deps = ["//backend/src/routers",
            "//backend/src/schemas",
            requirement("fastapi"),
            requirement("pydantic"),
            requirement("uvicorn")],
)
