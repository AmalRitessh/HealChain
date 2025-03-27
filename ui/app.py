from flask import Flask, render_template, request, redirect, url_for, jsonify
import os

app = Flask(__name__)

# Mock database for demonstration
campaigns = []
users = []

@app.route('/')
def index():
    create_form = request.args.get('create') == 'true'
    return render_template('index.html', create_form=create_form, campaigns=campaigns)

@app.route('/create_campaign', methods=['POST'])
def create_campaign():
    title = request.form['title']
    description = request.form['description']
    target_amount = request.form['targetAmount']
    deadline = request.form['deadline']
    medical_proof = request.form['medicalProof']
    
    # Handle file upload
    image = request.files['image']
    image_path = os.path.join('static', 'uploads', image.filename)
    image.save(image_path)
    
    campaign = {
        'title': title,
        'description': description,
        'target_amount': target_amount,
        'deadline': deadline,
        'medical_proof': medical_proof,
        'image': image_path
    }
    campaigns.append(campaign)
    
    return redirect(url_for('index'))

@app.route('/create_user', methods=['POST'])
def create_user():
    user_proof = request.form['userProof']
    user_pan = request.form['userPan']
    
    user = {
        'proof': user_proof,
        'pan': user_pan
    }
    users.append(user)
    
    return jsonify({'success': True})

@app.route('/update_user', methods=['POST'])
def update_user():
    contact = request.form['userContact']
    email = request.form['userEmailAddress']
    preference = request.form['userPreference']
    
    # Update user logic here
    return jsonify({'success': True})

@app.route('/view_campaign/<int:campaign_id>')
def view_campaign(campaign_id):
    campaign = campaigns[campaign_id] if campaign_id < len(campaigns) else None
    return render_template('view_campaign.html', campaign=campaign)

@app.route('/donate/<int:campaign_id>')
def donate(campaign_id):
    campaign = campaigns[campaign_id] if campaign_id < len(campaigns) else None
    return render_template('donate_campaign.html', campaign=campaign)

if __name__ == '__main__':
    os.makedirs(os.path.join(app.static_folder, 'uploads'), exist_ok=True)
    app.run(debug=True)