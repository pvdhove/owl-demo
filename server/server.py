from flask import Flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug import secure_filename
import os

app = Flask(__name__)
#CORS(app, resources={r"/upload": {"origins": "*"}})
CORS(app)
app.config['UPLOAD_FOLDER'] = 'inception_img/'

@app.route('/')
def hello_world():
    return 'Hello, World!'

ALLOWED_EXTENSIONS = set(['ppm', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if request.method == 'POST':
        # files = request.files.getlist('file[]')  
        f = request.files.get('uploadfile', '')
        if f and allowed_file(f.filename):
            filename = secure_filename(f.filename)
            #updir = os.path.join(app.config['UPLOAD_FOLDER'], 'upload/')
            file_addr = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            f.save(file_addr)
            file_size = os.path.getsize(file_addr)
        else:
            app.logger.info('ext name error')
            return jsonify(error='ext name error')
        return jsonify(name=filename, size=file_size)
    return "fuck!"

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)


# https://ampersandacademy.com/tutorials/flask-framework/flask-framework-ajax-file-upload