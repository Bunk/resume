SRC_DIR = .
BUILD_DIR = build
DIST_DIR = dist
TEMPLATE_DIR = templates
STYLE_DIR = styles
DATE = $(shell date +'%B %d, %Y')

# Default build is HTML resume
all: clean html view #pdf

# Target for building the resume in HTML
html: html_style $(TEMPLATE_DIR)/template.html5 $(SRC_DIR)/resume.md | directories
	pandoc --standalone \
		--section-divs \
		--smart \
		--template $(TEMPLATE_DIR)/template.html5 \
		--from markdown+yaml_metadata_block+header_attributes+definition_lists \
		--to html5 \
		--variable=date:'$(DATE)' \
		--css $(STYLE_DIR)/resume.css \
		--output $(DIST_DIR)/resume.html \
		$(SRC_DIR)/resume.md

html_style: $(STYLE_DIR)/resume.css | directories
	# TODO: Use compass here
	rsync -rupE $(STYLE_DIR)/ $(DIST_DIR)/styles/;

# Opens the document in a browser
view: html
	open $(DIST_DIR)/resume.html

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
	$(DIST_DIR)/resume.html \
	$(DIST_DIR)/resume.pdf

# Initializes working directories
directories: $(BUILD_DIR) $(DIST_DIR)
$(BUILD_DIR):
	mkdir $(BUILD_DIR)
$(DIST_DIR):
	mkdir $(DIST_DIR)

# Cleans the working directories
clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(DIST_DIR)
