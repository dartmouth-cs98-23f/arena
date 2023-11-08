load("@python_deps//:requirements.bzl", "requirement")
package(default_visibility=["//visibility:public"])

exports_files(["main.py"])

py_library(
    name = "auth",
    srcs = ["auth.py"],
    deps = [
        "//backend/src/models",
        requirement("fastapi"),
        requirement("pydantic")
    ]
)

py_binary(
    name = "add_api_key",
    srcs = ["add_api_key.py"],
    deps = [
        requirement("psycopg2-binary"),
        "//backend/src/models",
    ]
)