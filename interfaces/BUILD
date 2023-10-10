load("@com_google_protobuf//:protobuf.bzl", "py_proto_library")
load("@rules_proto_grpc//python:defs.bzl", "py_proto_library")
load("@rules_proto_grpc//js:defs.bzl", "js_proto_library")


package(default_visibility = ["//visibility:public"])

proto_library(
    name = "test_proto",
    srcs = ["test.proto"],
    deps = ["@com_google_protobuf//:empty_proto"]
)

py_proto_library(
    name = "test_proto_py",
    protos = ["test_proto"]
)

js_proto_library(
    name = "test_proto_js",
    protos = ["test_proto"]
)