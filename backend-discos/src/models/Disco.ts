import mongoose, { Document, Schema } from 'mongoose';

// 1. Define a Interface (para o TypeScript)
export interface IDisco extends Document {
    titulo: string;
    artista: string;
    ano: number;
    genero: string;
    formato: 'Vinil' | 'CD';
    preco: number;
}

// 2. Define o Schema (para o MongoDB)
const DiscoSchema: Schema = new Schema({
    titulo: {
        type: String,
        required: true // O título é obrigatório
    },
    artista: {
        type: String,
        required: true // O artista é obrigatório
    },
    ano: {
        type: Number,
        required: true
    },
    genero: {
        type: String,
        required: false // Gênero não é obrigatório
    },
    formato: {
        type: String,
        enum: ['Vinil', 'CD'], // Só aceita esses dois valores
        required: true
    },
    preco: {
        type: Number,
        required: true
    }
});

// 3. Exporta o Model
export default mongoose.model<IDisco>('Disco', DiscoSchema);