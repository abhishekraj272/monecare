import sys
from app import app, db, csrf
from flask import render_template, request
from bson.json_util import dumps
from flask_wtf.csrf import CsrfProtect
import re
from json import loads


@app.route("/")
def index():
    return render_template("public/index.html")


@app.route("/reqbin-verify.txt")
def reqbin():
    return "", 200


@app.route("/api/v1/repo-rate", methods=["GET", "PUT", "POST", "DELETE"])
def get_repo_rate():

    api_key = request.headers.get("API-KEY")

    if db.apiKey.count_documents({'key': api_key}, limit=1) == 0:
        return {"output": "API KEY Invalid"}, 401

    if request.method == "GET":
        repo_rates = None
        try:
            repo_rates = db.repoRate.find()
        except Exception as e:
            print(e, file=sys.stderr)

        if repo_rates:
            return dumps(list(repo_rates)), 200

        return {"output": "Database error"}, 400

    if request.method == "POST":
        date = request.form.get('date')
        repo_rate = request.form.get('repo_rate')

        if date and repo_rate:
            data = {"date": date, "rate": repo_rate}

            try:
                if (db.repoRate.find(data).count() > 0):
                    return {
                        "response": "Failed",
                        "output": "Document already exists"
                    }, 400
                db.repoRate.insert_one(data)
            except Exception as e:
                print(e, file=sys.stderr)
                return {"output": "Database error"}, 400
            return {"output": "Success"}, 200

        return {"response": "Failed", "output": "Invalid input"}, 400

    if request.method == "PUT":
        date = request.form.get('date')
        repo_rate = request.form.get('repo_rate')
        old_date = request.form.get('old_date')
        old_repo_rate = request.form.get('old_repo_rate')

        if date and repo_rate:
            try:
                record = {'date': old_date, 'rate': old_repo_rate}
                new_values = {"$set": {'date': date, 'rate': repo_rate}}
                db.repoRate.update_one(record, new_values)
                return {"output": "Success"}, 200
            except Exception as e:
                print(e, file=sys.stderr)
                return {"output": "Database error"}, 400

        return {
            "response": "Failed",
            "output": "Invalid input",
        }, 400

                print(e, file=sys.stderr)

def check(email, regex):

    # pass the regular expression
    # and the string in search() method
    if(re.search(regex, email)):
        return True

    else:
        return False


@app.route("/api/v1/subscribe", methods=["PUT"])
def subscribe():

    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

    name = request.form.get('name')
    email = request.form.get('email')
    analytics = request.form.get('analytics')

    analytics = loads(analytics)

    if check(email, regex):

        data = {
            "username": name,
            "email": email,
            "user_ip": analytics["geoplugin_request"],
            "user_country": analytics["geoplugin_countryName"],
            "user_city": analytics["geoplugin_city"]
        }

        try:
            db.subscriber.insert_one(data)
        except Exception as e:
            print(e)
            return {"output": "Database error"}, 400
        return {"output": "Success"}, 200

    return {"response": "Failed", "output": "Invalid email"}, 400
