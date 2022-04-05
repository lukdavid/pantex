FROM node:16

ENV pandoc_ver=2.17.1.1

# Install general dependencies
RUN apt-get -qq -y update 

# Download the specified version of pandoc and install it
RUN wget https://github.com/jgm/pandoc/releases/download/$pandoc_ver/pandoc-$pandoc_ver-1-arm64.deb -O pandoc.deb
RUN dpkg -i pandoc.deb && rm pandoc.deb 

RUN  apt-get install texlive-latex-extra -y

# Test Latex
COPY examples/small2e.tex small2e.tex
RUN latex  small2e.tex
RUN pdflatex  small2e.tex


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

RUN npm run build

COPY templates /usr/src/app/dist/templates

WORKDIR /usr/src/app/dist

RUN ls
RUN ls src/

EXPOSE 8080

CMD [ "node", "src/index.js" ]