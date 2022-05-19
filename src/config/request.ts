import axios from 'axios';
// import config from '.';

export type UserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export const getInfoUser = async (token: string): Promise<UserInfo> => {
  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: 'Bearer ' + token },
    },
  );
  return data;
};

export const getYtbBrand = async (token: string) => {
  const { data } = await axios.get(
    'https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true',
    { headers: { Authorization: 'Bearer ' + token } },
  );
  return data;
};

export const getListVideoLike = async (token: string, parrams = {}) => {
  try {
    const { data } = await axios.get(
      'https://youtube.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet,id,contentDetails,statistics,status,player',
          myRating: 'like',
          maxResults: 50,
          ...parrams,
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// YouTube has deprecated https://developers.google.com/youtube/v3/docs/activities#resource
export const getListVideoComment = async (token: string, parrams = {}) => {
  try {
    const { data } = await axios.get(
      'https://youtube.googleapis.com/youtube/v3/activities',
      {
        params: {
          part: 'snippet,contentDetails',
          maxResults: 50,
          mine: true,
          ...parrams,
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    return data;
  } catch (error) {
    throw error;
  }
};
