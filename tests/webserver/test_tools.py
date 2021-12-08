from pathlib import Path

from webserver.tools import find_languages, find_styles, get_defaults, pull_from_js

FIXTURE_ROOT = Path(Path(__file__).resolve().parent, "fixtures")


def test_pull_from_js():
    """Test it can pull correctly from some ES6."""
    data = 'export let en = {\n  name: "English",\n  data: [[{ class: "it" }]],\n};\n'
    assert pull_from_js(data, "name") == "English"


def test_find_styles():
    """Test it finds the stylesheets."""
    assert find_styles(root=Path(FIXTURE_ROOT, "static")) == ["bar", "baz", "foo"]


def test_find_languages():
    """Test it finds the language files."""
    assert find_languages(root=Path(FIXTURE_ROOT, "static")) == {
        "eu": "Basque",
        "pl": "Polish",
        "uk": "Ukrainian",
    }


def test_get_defaults():
    """Test it finds the defaults."""
    assert get_defaults(root=Path(FIXTURE_ROOT, "static")) == {
        "language": "no",
        "style": "banana",
    }
