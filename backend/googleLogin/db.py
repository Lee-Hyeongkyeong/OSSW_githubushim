# http://flask.pocoo.org/docs/1.0/tutorial/database/
import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            "sqlite_db", detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf8"))


@click.command("init-db")
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo("Initialized the database.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

#설문조사

def save_survey_result(user_id, travel_style, priority, places, purposes, must_go, total_score):
    conn = sqlite3.connect("sqlite_db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO survey_results (user_id, travel_style, priority, places, purposes, must_go, total_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        travel_style,
        ",".join(priority),
        ",".join(places),
        ",".join(purposes),
        ",".join(must_go),
        total_score
    ))

    conn.commit()
    conn.close()

