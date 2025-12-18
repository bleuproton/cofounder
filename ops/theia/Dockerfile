FROM ghcr.io/eclipse-theia/theia:1.46.0

USER root
ENV NVM_DIR=/home/theia/.nvm
RUN apt-get update \
 && apt-get install -y curl ca-certificates git \
 && rm -rf /var/lib/apt/lists/*
RUN mkdir -p "$NVM_DIR" \
 && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
 && . "$NVM_DIR"/nvm.sh \
 && nvm install 22 \
 && nvm alias default 22 \
 && nvm cache clear
ENV PATH=/home/theia/.nvm/versions/node/v22.*/bin:$PATH

USER theia
WORKDIR /home/project

CMD ["node", "/home/theia/src-gen/backend/main.js", "/home/project", "--hostname", "0.0.0.0", "--port", "3000"]
