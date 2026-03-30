// Importar el cliente de Supabase (debes instalarlo o usar CDN)
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-anon-key';

let supabase;

export function initDatabase() {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase inicializado');
}

// Obtener metales desde la tabla 'metals'
export async function loadMetals() {
    if (!supabase) initDatabase();
    const { data, error } = await supabase
        .from('metals')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
}

// Obtener gemas desde la tabla 'gems'
export async function loadGems() {
    if (!supabase) initDatabase();
    const { data, error } = await supabase
        .from('gems')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
}

// Obtener colecciones
export async function loadCollections() {
    if (!supabase) initDatabase();
    const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
}

// Enviar una consulta
export async function submitInquiry(inquiry) {
    if (!supabase) initDatabase();
    const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiry]);
    if (error) throw error;
    return data;
}