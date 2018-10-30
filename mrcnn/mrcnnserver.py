from flask import Flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug import secure_filename
import os, subprocess, json
from subprocess import call
import pickle

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'mrcnn_img/'

img_dir = 'results/'

@app.route('/')
def hello_world():
    return 'Hello, World!'

ALLOWED_EXTENSIONS = set(['ppm', 'png', 'jpg', 'jpeg', 'gif', 'PNG'])

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/counter', methods=['GET', 'POST', 'OPTIONS'])
def counter():
    with open('counter.txt', 'r+') as f:
        counter = int(next(f))
    return jsonify(counter)

@app.route('/upload', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if request.method == 'POST':
        # files = request.files.getlist('file[]')

        f = request.files.get('uploadfile', '')
        if f and allowed_file(f.filename):
            filename = secure_filename(f.filename)
            file_addr = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            f.save(file_addr)

            try:
                resp = subprocess.check_output(['executable/demo.exe', file_addr])
            except subprocess.CalledProcessError as e:
                print(e.output)
                raise
                
            new_img = img_dir + filename

            #d = json.loads(resp)
            # Get counter number
            with open('counter.txt', 'r+') as f:
                old_counter = int(next(f))
                new_counter = old_counter + 1
                f.seek(0)
                f.write(str(new_counter) + '\n')
                f.truncate()
            return jsonify([new_counter, new_img, resp])
        else:
            app.logger.info('ext name error')
            return [] #jsonify(error='ext name error')
    return ""


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5002,debug=True)
