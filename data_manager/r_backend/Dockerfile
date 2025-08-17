FROM public.ecr.aws/lambda/provided:al2023-arm64

# Setting home env variable
ENV HOME=/root

RUN dnf update -y

# Install R and system dependencies
RUN dnf -y install R awscli wget tar
RUN dnf -y install poppler-cpp-devel libpsl-devel perl-core

# System requirements for R packages jpeg/png for tableHTML, xml2 for paws
RUN dnf -y install openssl-devel libxml2-devel libjpeg-turbo-devel libpng-devel

# Install R packages
RUN Rscript -e "install.packages(c('lambdr','jsonlite'), repos = 'https://cloud.r-project.org/')"

# Copy R files to Lambda task root
COPY *.R ${LAMBDA_TASK_ROOT}/
RUN chmod 755 -R ${LAMBDA_TASK_ROOT}/

# Create bootstrap script that calls the correct R file
RUN printf '#!/bin/sh\nexport HOME=/root\nRscript lambda.R' \
     > /var/runtime/bootstrap \
  && chmod +x /var/runtime/bootstrap

CMD ["lambda_manager"]

