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
RUN latex small2e.tex
RUN pdflatex small2e.tex


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

COPY templates /usr/src/app/dist/templates

EXPOSE 5001

CMD [ "npm", "start" ]