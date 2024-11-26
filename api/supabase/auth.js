//supabase/auth.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const auth = {
  getOpenAiKey: async (user_id) => {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: settingData, error } = await supabase
        .from('UserInfo')
        .select('openai_key')
        .eq('user_id', user_id);

      if (error) {
        return { message: error.message };
      }

      return settingData[0].openai_key;
    } catch (error) {
      return { message: error.message };
    }
  },
  getSettingByUser : async (user_id) => {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: settingData, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user_id);

      if (error) {
        return { message: error.message };
      }
      return settingData[0];
    } catch (error) {
      return { message: error.message };
    }
  },
};

export default auth;
