FROM dimkk/nodebb



COPY package.json package.json  
COPY package-lock.json package-lock.json  
COPY ./src/index.ts index.ts

RUN npm install 

ENTRYPOINT [ "node", "executable" ]
