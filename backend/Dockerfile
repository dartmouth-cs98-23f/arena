# Use an official Bazel image as the base image
FROM bazel:latest

# Set the working directory inside the container
WORKDIR /app

# Copy your Bazel BUILD files and WORKSPACE file into the container
COPY WORKSPACE .
COPY BUILD .

# Copy the rest of your application source code into the container
COPY . .

# Build your application using Bazel
RUN bazel build //path/to:your_bazel_target  # Replace with your actual Bazel target

# Expose any necessary ports
EXPOSE 8080

# Define the command to run your application
CMD ["./bazel-bin/path/to/your/binary"]  # Replace with the path to your built binary

