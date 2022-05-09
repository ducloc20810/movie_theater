import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Filter from "../../components/FIlter/Filter";
import "./index.scss";
import FilmList from "../../components/FilmList/FilmList";
import axios from "axios";
import urlGenerator from "../../config/urlGenerator";
import FetchMoreButton from "../../components/FetchMoreButton/FetchMoreButton";
export default function TypePage() {
  const { media_type } = useParams();
  const [queryParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [page, setCurrentPage] = useState(1);
  const [fetchParams, setFetchParams] = useState({});
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(false);

  function handleClick() {
    setCurrentPage((page) => page + 1);
  }

  useEffect(() => {
    if (page === 1) return;

    (async function () {
      setLoading(true);
      const params = { ...fetchParams, page };
      const res = await axios.get(urlGenerator.getDiscoverUrl(media_type), {
        params,
      });
      console.log(res.data);
      setData((oldData) => [...oldData, ...res.data.results]);
      setLoading(false);
    })();
  }, [page]);

  useEffect(() => {
    const params = { api_key: process.env.REACT_APP_API_KEY, page: 1 };
    for (let entry of queryParams.entries()) {
      let query = "";
      const data = entry[1];
      switch (entry[0]) {
        case "genre":
          query = "with_genres";
          break;
        case "country":
          query = "with_original_language";
          break;
        case "year":
          if (data < 0) {
            query = "primary_release_date.lte";
          } else {
            query = "primary_release_year";
          }
          break;

        case "sort":
          query = "sort_by";
          break;

        default:
          break;
      }

      params[query] = entry[1];
    }

    (async function () {
      setLoading(true);
      const res = await axios.get(urlGenerator.getDiscoverUrl(media_type), {
        params,
      });

      setData(res.data.results);
      setFetchParams(params);
      setTotalResult(res.data.total_results);
      setCurrentPage(1);
      setLoading(false);
      setIsFetch(true);
    })();
  }, [queryParams, media_type]);

  return (
    <div className="type container">
      <h1 className="type__media">
        {media_type === "tv" ? "Phim bộ" : "Phim lẻ"}
      </h1>

      <Filter media_type={media_type} />
      {isFetch && !loading && data.length > 0 && (
        <section>
          <FilmList films={data} media_type={media_type} />

          {data.length < totalResult && (
            <FetchMoreButton handleFunction={handleClick} />
          )}
        </section>
      )}

      {isFetch && !loading && data.length === 0 && (
        <h1 className="result">Không tìm thấy phim</h1>
      )}
      {loading && data.length === 0 && <h1 className="result">Loading...</h1>}
      {loading && data.length && (
        <section>
          <FilmList films={data} />
          <h1 className="result">Loading...</h1>
        </section>
      )}
    </div>
  );
}