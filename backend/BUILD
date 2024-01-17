package(default_visibility=["//visibility:public"])

load("@rules_python//python:defs.bzl", "py_binary")
load("@python_deps//:requirements.bzl", "requirement")
load("@io_bazel_rules_docker//python3:image.bzl", "py3_image")
load("@io_bazel_rules_docker//container:push.bzl", "container_push")



py_binary(
    name = "main",
    srcs = ["//backend/src:main.py"],
    deps = ["//backend/src/routers",
            "//backend/src/schemas",
            requirement("fastapi"),
            requirement("pydantic"),
            requirement("uvicorn")],
)


py3_image(
    name = "arena_image",
    srcs = ["//backend/src:main.py"],
    deps = [requirement("fastapi"),
            requirement("pydantic"),
            requirement("uvicorn")],
    main = "main.py",
)

container_push(
    name = "push_arena",
    image = ":arena_image",
    format = "Docker",
    registry = "ghcr.io",
    repository = "dartmouth-cs98-23f/arena",
    tag = "dev"
)
