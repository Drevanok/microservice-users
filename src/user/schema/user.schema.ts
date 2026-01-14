import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 30},
    username: {type: String, required: true, minlength: 3, maxlength: 8},
    email: {type: String, required: true, minlength: 3, maxlength: 50},
    password: {type: String, required: true},
},
{
    timestamps: true,
});

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
