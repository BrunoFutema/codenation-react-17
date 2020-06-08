import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getCategoryPlaylistRequest,
  getCategoryPlaylistSuccess,
  getCategoryPlaylistFailed,
  logout,
} from '../actions';

import { Playlists } from '../containers';

import { endpoints } from '../modules/endpoints';
import { getContentNameById } from '../modules/helpers';
import { request, sanitizeUrl } from '../modules/request';

const { getCategoryPlaylists } = endpoints;

const PlaylistsRoute = ({ path }) => {
  const { auth, content } = useSelector(state => state);
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestOptions = {
      ...getCategoryPlaylists.options,
      headers: { 'Authorization': `Bearer ${auth.accessToken}` },
    };

    dispatch(getCategoryPlaylistRequest());

    request(sanitizeUrl(getCategoryPlaylists.url, { categoryId }), requestOptions)
      .then(data => dispatch(getCategoryPlaylistSuccess(data)))
      .catch(err => {
        if (err === 401) {
          dispatch(logout());
          return;
        }

        dispatch(getCategoryPlaylistFailed(err));
      });
  }, [auth, categoryId, dispatch]);

  return (
    <Playlists
      categoryId={categoryId}
      categoryName={getContentNameById(categoryId, content.categories)}
      data={content.playlists}
      isLoading={content.status === 'running' && content.playlists.length === 0}
      path={path}
    />
  );
};

export default PlaylistsRoute;
