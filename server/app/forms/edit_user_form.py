from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.api.aws_image_helpers import ALLOWED_IMAGE_EXTENSIONS

from app.models import User

def username_taken(form, field):
    new_username = field.data
    username = User.query.filter(User.username == new_username).first()
    if username:
        raise ValidationError("This username is already taken.")

class EditProfile(FlaskForm):
    username = StringField("Change your username.", validators=[DataRequired()])
    pic_url = FileField("Set a picture for your profile", validators=[FileAllowed(list(ALLOWED_IMAGE_EXTENSIONS))])
    about = StringField("Tell others about yourself.", validators=[DataRequired()])
    link_1 = StringField("Link your other accounts.", validators=[DataRequired()])
    link_2 = StringField("Link your other accounts.", validators=[DataRequired()])
    link_3 = StringField("Link your other accounts.", validators=[DataRequired()])