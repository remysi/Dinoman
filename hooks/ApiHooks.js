import {useEffect, useState, useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {doFetch} from '../utils/http';
import {apiUrl, applicationTag} from '../utils/variables';

const useMedia = (update, myFilesOnly = false) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [mediaBoughtArray, setMediaBoughtArray] = useState([]);

  const {user} = useContext(MainContext);
  const loadMedia = async () => {
    try {
      let json = await doFetch(apiUrl + 'tags/' + applicationTag);
      console.log(json);
      // json = json.filter(await doFetch(apiUrl + 'tags/' + applicationTag + '_sold_'));
      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }

      json.reverse();

      const allMediaData = json.map(async (mediaItem) => {
        return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
      });
      setMediaArray(await Promise.all(allMediaData));
    } catch (error) {
      console.log('media fetch failed', error);
    }
  };

  const loadBoughtMedia = async () => {
    try {
      let json = await doFetch(
        apiUrl + 'tags/' + applicationTag + '_sold_' + user.user_id
      );
      console.log(json);

      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }

      json.reverse();

      const allMediaData = json.map(async (mediaItem) => {
        return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
      });
      setMediaBoughtArray(await Promise.all(allMediaData));
    } catch (error) {
      console.log('media fetch failed', error);
    }
  };

  useEffect(() => {
    loadMedia();
    loadBoughtMedia();
  }, [update]);

  const postMedia = async (token, data) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: data,
    };

    try {
      return await doFetch(apiUrl + 'media', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const putMedia = async (token, data, fileId) => {
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(data),
    };

    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };

    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {mediaArray, mediaBoughtArray, postMedia, putMedia, deleteMedia};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(apiUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const checkUsername = async (username) => {
    try {
      const result = await doFetch(apiUrl + 'users/username/' + username);
      console.log('checkUsername():', result);
      return result.available;
    } catch (error) {
      console.log('checkUsername() failed', error);
    }
  };
  const getUserByToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(apiUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(apiUrl + 'users', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const putUser = async (token, userData) => {
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(userData),
    };

    try {
      return await doFetch(apiUrl + 'users', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // eslint-disable-next-line camelcase
  const getUserById = async (token, user_id) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const acquiredUserData = await doFetch(
        // eslint-disable-next-line camelcase
        apiUrl + 'users/' + user_id,
        options
      );
      return acquiredUserData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {checkUsername, getUserByToken, postUser, getUserById, putUser};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    return await doFetch(apiUrl + 'tags/' + tag);
  };

  const postTag = async (token, tag) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    };
    try {
      return await doFetch(apiUrl + 'tags', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useComment = () => {
  const postBid = async (token, biddedAmount) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(biddedAmount),
    };
    try {
      return await doFetch(apiUrl + 'comments', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getCommentByFile = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      return await doFetch(apiUrl + 'comments/file/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postBid, getCommentByFile};
};

export {useMedia, useUser, useLogin, useTag, useComment};
