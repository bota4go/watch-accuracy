# Watch Drift — system architecture
# Renders a PNG for the README. Requires: pip install -r docs/diagrams/requirements.txt
# and Graphviz: https://graphviz.org (Windows: choco install graphviz)
# Run from repo root:  python docs/diagrams/watch_drift_arch.py
#
# Style inspired by: https://diagrams.mingrammer.com/docs/getting-started/examples
from __future__ import annotations

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.client import User
from diagrams.onprem.compute import Server
from diagrams.onprem.database import PostgreSQL
from diagrams.programming.language import NodeJS

_HERE = os.path.dirname(os.path.abspath(__file__))


def main() -> None:
    prev = os.getcwd()
    os.chdir(_HERE)
    try:
        with Diagram(
            "Watch Drift",
            show=False,
            outformat="png",
            filename="watch_drift_arch",
            direction="LR",
        ):
            user = User("User (browser)")

            with Cluster("Vercel"):
                next_app = NodeJS("Next.js 14\n(React + API)")
                nauth = Server("NextAuth\n(Google)")

            idp = Server("Google\nIdentity (OAuth 2.0)")
            db = PostgreSQL("Neon\nPostgres + Prisma")

            user >> next_app
            user >> nauth
            nauth >> Edge(label="token") >> idp
            nauth - Edge(style="dashed", label="session") - next_app
            next_app >> Edge(label="Prisma") >> db
    finally:
        os.chdir(prev)


if __name__ == "__main__":
    main()
    out = os.path.join(_HERE, "watch_drift_arch.png")
    if os.path.isfile(out):
        print("Wrote", out)
    else:
        print("Expected", out, "- check Graphviz (dot) is on PATH")
