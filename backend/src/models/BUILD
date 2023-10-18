load("@python_deps//:requirements.bzl", "requirement")

package(default_visibility=["//visibility:public"])

py_library(
    name = "models",
    srcs = [
        "__init__.py",
        "database.py",
        "keys.py"
    ],
    deps = [
        requirement("sqlalchemy"),
        requirement("motor")
    ]
)