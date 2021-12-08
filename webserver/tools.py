from pathlib import Path

from git import Repo

GITHUB_REPO = "pikesley/jlock"


def get_git_data():
    """Assemble some Git metadata."""
    repo = Repo(Path(Path(__file__).resolve().parent.parent))

    timestamp = repo.head.object.authored_datetime.isoformat()
    timestamp = timestamp.split("+")[0].replace("T", " ")

    repo_url = f"https://github.com/{GITHUB_REPO}"
    head_sha = repo.head.object.hexsha
    head_url = f"{repo_url}/tree/{head_sha}"

    author_name = repo.head.object.author.name
    author_link = f"https://github.com/{author_name}"

    return {
        "commit": repo.git.rev_parse(head_sha, short=True),
        "urls": {
            "repo": repo_url,
            "head": head_url,
        },
        "author": {"name": author_name, "github_link": author_link},
        "timestamp": timestamp,
    }
