# Use an official Python runtime as a parent image
FROM ubuntu:22.04

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy Bazel files
COPY BUILD /app/BUILD
COPY WORKSPACE /app/WORKSPACE
COPY backend /app/backend
COPY interfaces /app/interfaces
# You may need to copy more files depending on your Bazel setup

# NOTE 'g++ unzip zip' are required by bazel
RUN apt update && apt install -y wget g++ unzip zip python3 python3-pip

RUN wget https://github.com/bazelbuild/bazelisk/releases/download/v1.15.0/bazelisk-linux-amd64 && \
    chmod 755 bazelisk-linux-amd64 && \
    mv bazelisk-linux-amd64 /usr/bin/bazelisk

# Build the application with Bazel
RUN /usr/bin/bazelisk build //backend:main

# Optionally, clean up Bazel cache to reduce Docker image size
RUN /usr/bin/bazelisk clean --expunge

# Expose the port the app runs on
EXPOSE 5000

# Run the app
CMD ["bazel, "run", "//backend:main"]
