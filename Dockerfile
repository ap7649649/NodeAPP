FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD [ "npm","start" ]
# ENTRYPOINT [ "sh", "-c", "npm run $0", "--" ]

# CMD [ "sh", "-c", "npm run $COMMAND", "--" ](ENTRYPOINT not required)
# docker run -e COMMAND=test <image-name>
# -e set environment flag

# docker run my-image start
# docker run my-image test

# "sh": Specifies the command interpreter to be used. In this case, it's sh, which is a Unix shell.
# "-c": Tells the shell to read commands from the following string.
# "npm run $0": The command to be executed inside the container. $0 is a special shell variable that represents the first argument passed to the shell. In this case, it will be replaced with the command passed as an argument to docker run.
# "--": Specifies the end of the command string. This is necessary because docker run may add its own arguments after the command.