# Step 1: Use the official Nginx image, which is very lightweight and performant.
FROM nginx:alpine

# Step 2: Copy our game files into the folder that Nginx uses to serve websites.
# The first dot "." refers to the content of the folder where the Dockerfile is located.
COPY . /usr/share/nginx/html

# Step 3: Expose port 80. This is the default port on which Nginx listens inside the container.
EXPOSE 80