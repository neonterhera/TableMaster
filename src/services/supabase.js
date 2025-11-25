import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Floor operations
export const floorService = {
    // Get all floors
    async getAll() {
        const { data, error } = await supabase
            .from('floors')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Create a new floor
    async create(name) {
        const { data, error } = await supabase
            .from('floors')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update floor name
    async update(id, name) {
        const { data, error } = await supabase
            .from('floors')
            .update({ name, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a floor
    async delete(id) {
        const { error } = await supabase
            .from('floors')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Subscribe to floor changes
    subscribe(callback) {
        const channel = supabase
            .channel('floors-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'floors' },
                callback
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
};

// Table operations
export const tableService = {
    // Get all tables
    async getAll() {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Create a new table
    async create(tableData) {
        const { data, error } = await supabase
            .from('tables')
            .insert([tableData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update table
    async update(id, updates) {
        const { data, error } = await supabase
            .from('tables')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a table
    async delete(id) {
        const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Subscribe to table changes
    subscribe(callback) {
        const channel = supabase
            .channel('tables-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'tables' },
                callback
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
};
