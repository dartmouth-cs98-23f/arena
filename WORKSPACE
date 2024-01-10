workspace(name = "arena")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

#------------------------------------------------------------------
# grpc rules
#------------------------------------------------------------------
http_archive(
    name = "rules_proto_grpc",
    sha256 = "",
    strip_prefix = "rules_proto_grpc-4.6.0",
    urls = ["https://github.com/rules-proto-grpc/rules_proto_grpc/releases/download/4.6.0/rules_proto_grpc-4.6.0.tar.gz"],
)


load("@rules_proto_grpc//:repositories.bzl", "rules_proto_grpc_toolchains", "rules_proto_grpc_repos")
rules_proto_grpc_toolchains()
rules_proto_grpc_repos()

load("@rules_proto_grpc//js:repositories.bzl", rules_proto_grpc_js_repos = "js_repos")

rules_proto_grpc_js_repos()

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

yarn_install(
    name = "npm",
    package_json = "@rules_proto_grpc//js:requirements/package.json",  # This should be changed to your local package.json which should contain the dependencies required
    yarn_lock = "@rules_proto_grpc//js:requirements/yarn.lock",
)

#------------------------------------------------------------------
# Python
#------------------------------------------------------------------
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_python",
    sha256 = "5868e73107a8e85d8f323806e60cad7283f34b32163ea6ff1020cf27abef6036",
    strip_prefix = "rules_python-0.25.0",
    url = "https://github.com/bazelbuild/rules_python/releases/download/0.25.0/rules_python-0.25.0.tar.gz",
)


load("@rules_python//python:repositories.bzl", "python_register_toolchains")

python_register_toolchains(
    name = "python_3_10",
    # Available versions are listed in @rules_python//python:versions.bzl.
    # We recommend using the same version your team is already standardized on.
    python_version = "3.10",
    ignore_root_user_error = True,
)

load("@python_3_10//:defs.bzl", "interpreter")


load("@rules_python//python:pip.bzl", "pip_parse")

pip_parse(
    name = "python_deps",
    python_interpreter_target = interpreter,
    requirements_lock = "//backend:requirements_lock.txt"
)

# Load the starlark macro, which will define your dependencies.
load("@python_deps//:requirements.bzl", "install_deps")
# Call it to define repos for your requirements.
install_deps()

http_archive(
    name = "com_google_protobuf",
    sha256 = "",
    strip_prefix = "protobuf-3.20.3",
    # latest, as of 2020-02-217
    urls = [
        "https://mirror.bazel.build/github.com/protocolbuffers/protobuf/archive/v3.20.3.tar.gz",
        "https://github.com/protocolbuffers/protobuf/archive/v3.20.3.tar.gz",
    ],
)

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()


