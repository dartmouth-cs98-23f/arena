package(default_visibility=["//visibility:public"])

load("@rules_python//python:defs.bzl", "py_binary")
load("@python_deps//:requirements.bzl", "requirement")

py_library(
    name = "routers",
    srcs = ["__init__.py",
            "index.py"],
    deps = [requirement("fastapi"),
        requirement("pydantic")]
)