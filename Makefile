SRC_DIR = ./src
DIST_DIR = ./public
TEMPLATE_DIR = templates
STYLE_DIR = styles
DATE = $(shell date +'%B %d, %Y')

# Default build is HTML resume
all: clean html view #pdf

# Target for building the resume in HTML
html: html_style $(SRC_DIR)/$(TEMPLATE_DIR)/resume.html5 $(SRC_DIR)/resume.md | directories
	docker run -v `pwd`:/source jagregory/pandoc \
		--standalone \
		--section-divs \
		--smart \
		--template $(SRC_DIR)/$(TEMPLATE_DIR)/resume.html5 \
		--from markdown+yaml_metadata_block+header_attributes+definition_lists \
		--to html5 \
		--variable=date:'$(DATE)' \
		--css $(STYLE_DIR)/resume.css \
		--output $(DIST_DIR)/index.html \
		$(SRC_DIR)/resume.md

html_style: $(SRC_DIR)/$(STYLE_DIR)/resume.css | directories
	rsync -rupE $(SRC_DIR)/$(STYLE_DIR)/ $(DIST_DIR)/$(STYLE_DIR)/;

# Opens the document in a browser
view: html
	open $(DIST_DIR)/index.html

# Target for building the resume as a PDF
pdf: html
	wkhtmltopdf \
	--print-media-type \
	--orientation Portrait \
	--page-size A4 \
	--margin-top 15 \
	--margin-left 15 \
	--margin-right 15 \
	--margin-bottom 15 \
	$(DIST_DIR)/index.html \
	$(DIST_DIR)/resume.pdf

# Initializes working directories
directories: $(DIST_DIR)
$(DIST_DIR):
	mkdir $(DIST_DIR)

# Cleans the working directories
clean:
	rm -rf $(DIST_DIR)
