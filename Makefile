SRC_DIR = ./src
DIST_DIR = ./public
TEMPLATE_DIR = templates
STYLE_DIR = styles
DATE = $(shell date +'%B %d, %Y')

# Default build is HTML resume
all: clean md html pdf

md: directories
	docker run -v `pwd`:/source jagregory/pandoc \
		--from markdown+yaml_metadata_block+header_attributes+definition_lists \
		--to markdown \
		--variable=date:'$(DATE)' \
		--output $(DIST_DIR)/resume.md \
		$(SRC_DIR)/resume.md

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
	docker run -v `pwd`/$(DIST_DIR):/$(DIST_DIR) openlabs/docker-wkhtmltopdf \
	--print-media-type \
	--orientation Portrait \
	--page-size A4 \
	--margin-top 0 \
	--margin-left 0 \
	--margin-right 0 \
	--margin-bottom 0 \
	--disable-smart-shrinking \
	$(DIST_DIR)/index.html \
	$(DIST_DIR)/resume.pdf

# Initializes working directories
directories: $(DIST_DIR)
$(DIST_DIR):
	mkdir $(DIST_DIR)

# Cleans the working directories
clean:
	rm -rf $(DIST_DIR)
