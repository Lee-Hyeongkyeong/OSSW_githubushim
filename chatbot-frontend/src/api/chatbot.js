const API_BASE_URL = 'http://localhost:5000';

export const sendMessage = async (message, latitude, longitude) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: message,
                latitude: latitude,
                longitude: longitude
            })
        });
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        
        return await response.json();
    } catch (error) {
        console.error('메시지 전송 중 오류:', error);
        throw error;
    }
};

export const getSession = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/session?user_id=${userId}`);
        if (!response.ok) {
            throw new Error('세션 조회 실패');
        }
        return await response.json();
    } catch (error) {
        console.error('세션 조회 중 오류:', error);
        throw error;
    }
};

export const resetSession = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/session/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });
        
        if (!response.ok) {
            throw new Error('세션 초기화 실패');
        }
        
        return await response.json();
    } catch (error) {
        console.error('세션 초기화 중 오류:', error);
        throw error;
    }
}; 