FROM haskell:7.10

MAINTAINER JD Courtoy <jd.courtoy@gmail.com>

ENV PANDOC_VERSION "1.14.1"

# install Pandoc
RUN cabal update && cabal install pandoc-${PANDOC_VERSION}

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-xetex \
    latex-xcolor \
    texlive-math-extra \
    texlive-latex-extra \
    texlive-fonts-extra \
    texlive-bibtex-extra \
    fontconfig \
    git \
    ssh \
    tar \
    gzip \
    ca-certificates

WORKDIR /src

ENTRYPOINT ["/root/.cabal/bin/pandoc"]

CMD ["--help"]
