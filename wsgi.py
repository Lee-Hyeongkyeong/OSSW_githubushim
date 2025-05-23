from googleLogin.app import app
print(app.url_map)
if __name__ == "__main__":
    app.run(ssl_context="adhoc")
