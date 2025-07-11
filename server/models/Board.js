import mongose from 'mongoose';

const boardSchema = new mongose.Schema({
    nombre:{type:String, required:true},
    creador:{type: mongose.Schema.Types.ObjectId, ref: "Usuario", required:true},
    miembros: [{type: mongose.Schema.Types.ObjectId, ref: "Usuario"}],
}, {timestamps: true});

export const Board = mongose.model('Board', boardSchema);

