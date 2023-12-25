FROM node:20

RUN npm install husky eslint typescript @angular/cli @compodoc/compodoc sass-lint sassdoc -g
RUN npm install npx -g --force

WORKDIR /twitter-parody

COPY ./.gitconfig /root/.gitconfig
COPY ./.ssh /root/.ssh

ENV LANG C.UTF-8
ENV TZ America/Sao_Paulo

EXPOSE 9229
EXPOSE 4200

# The run the start script
CMD [ "/bin/bash" ]
