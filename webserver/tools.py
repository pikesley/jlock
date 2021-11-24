from pathlib import Path

STATIC_ROOT = Path(Path(__file__).resolve().parent.parent, "static")


def get_defaults(root=STATIC_ROOT):
    """Get the default language and style from the JS."""
    defaults = {}

    conf_file = Path(root, "js", "conf.js")
    content = Path(conf_file).read_text(encoding="UTF-8")

    defaults["language"] = pull_from_js(content, "language")
    defaults["style"] = pull_from_js(content, "style")

    return defaults


def pull_from_js(content, key):
    """Pull a value from some ES6."""
    # we have to parse fucking ES6 because ES6 cannot natively import fucking JSON
    return list(filter(lambda x: f"{key}:" in x, content.split("\n")))[0].split('"')[1]


def find_styles(root=STATIC_ROOT):
    """Find the available styles."""
    return sorted(
        list(
            map(
                lambda x: Path(x).stem,
                filter(
                    lambda x: str(x).endswith(".css"),
                    Path(Path(root, "css", "clocks")).glob("*"),
                ),
            )
        )
    )


def find_languages(root=STATIC_ROOT):
    """Find the available languages."""
    languages = {}
    lang_root = Path(root, "js", "internationalisation", "languages")
    files = Path(lang_root).glob("*")
    for file in files:
        posix = Path(lang_root, file)
        content = posix.read_text(encoding="UTF-8")
        languages[posix.stem] = pull_from_js(content, "name")

    return languages
