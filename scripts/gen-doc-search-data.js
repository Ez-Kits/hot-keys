import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import glob from "fast-glob";
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
import MarkdownIt from "markdown-it";
import slugify from "slugify";
import { parse as parseYaml } from "yaml";

const md = new MarkdownIt({
	html: true,
});

function generateDocSectionsFromHTMl(html) {
	const dom = new JSDOM(html);
	const document = dom.window.document;

	const sections = [];

	const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
	const headerTitlesInfo = {
		lastLevel: 0,
		titles: [],
	};
	headers.forEach((header) => {
		const sectionTitle = header.textContent.trim();
		const headerTag = header.tagName.toLowerCase();

		const level = parseInt(headerTag.replace("h", ""));
		if (level > headerTitlesInfo.lastLevel) {
			headerTitlesInfo.lastLevel = level;
			headerTitlesInfo.titles.push(sectionTitle);
		} else {
			headerTitlesInfo.lastLevel = level;
			headerTitlesInfo.titles.pop();
			headerTitlesInfo.titles.push(sectionTitle);
		}

		let sectionContent = "";

		let sibling = header.nextElementSibling;
		while (
			sibling &&
			!["H2", "H3", "H4", "H5", "H6"].includes(sibling.tagName)
		) {
			sectionContent += sibling.textContent.trim() + "\n";
			sibling = sibling.nextElementSibling;
		}

		sections.push({
			title: headerTitlesInfo.titles.slice(0),
			header: headerTag,
			hash: slugify(sectionTitle, { lower: true }),
			content: sectionContent,
		});
	});

	return sections;
}

function generateDocSectionsFromMarkdown(md, markdown) {
	const html = md.render(markdown);
	return generateDocSectionsFromHTMl(html);
}

function scanDocFiles() {
	const files = glob.globSync("docs/**/*.md", {});
	return files;
}

function generateDocSearchData() {
	const files = scanDocFiles();

	const searchData = [];

	files.forEach((file) => {
		const markdown = readFileSync(file, "utf8");
		const markdownWithoutFrontmatter = markdown.replace(
			/^---\n[\s\S]*?\n---/,
			""
		);

		let title = "";
		const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)[1];

		if (frontmatter) {
			const frontmatterObj = parseYaml(frontmatter);
			title = frontmatterObj.title;
		}

		const sections = generateDocSectionsFromMarkdown(
			md,
			markdownWithoutFrontmatter
		);
		const path = file.replace("docs/", "").replace(".md", "");
		sections.forEach((section) => {
			searchData.push({
				framework: path.split("/")[0],
				path: path.split("/").slice(1).join("/"),
				title,
				section,
			});
		});
	});

	return searchData;
}

async function generateAndUploadDocSearchData() {
	const refName = process.argv[2];
	const accessKeyId = process.argv[3];
	const secretAccessKey = process.argv[4];

	if (!refName) {
		console.error("Ref name is required");
		process.exit(1);
	}

	if (!accessKeyId || !secretAccessKey) {
		console.error("Access key id and secret access key are required");
		process.exit(1);
	}

	const s3 = new S3Client({
		endpoint:
			"https://b978a5779b3a191f7294f9da3c8842eb.r2.cloudflarestorage.com",
		region: "auto",
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	console.log("Generating search data...");
	const searchData = generateDocSearchData();

	console.log("Uploading search data to R2...");
	const putCommand = new PutObjectCommand({
		Bucket: "ez-kits",
		ContentType: "application/json",
		Key: `docs-search-data-${refName}.json`,
		Body: JSON.stringify(searchData, null, 2),
	});

	await s3.send(putCommand);

	console.log("Search data uploaded to R2");
}

generateAndUploadDocSearchData();
