from flask import Flask, render_template, url_for, session, request, redirect, jsonify

app = Flask('__name__')
app.secret_key = "hello"

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/create_user')
def create_user():
	return render_template('create_user.html')

@app.route('/donate_campaign')
def donate_campaign():
    return render_template('donate_campaign.html')

@app.route('/view_campaign')
def view_campaign():
    return render_template('view_campaign.html')

if __name__ == '__main__':
	app.run(debug = True)