// @module import
import Head from 'next/head';
import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

// AIzaSyBj8ShCN6Y0-YtKPtlR6bwxcHvXjaGiOds

// @local import
import './index.css';
import { withTranslation } from '../../i18n';


// @component
const AutocompleteInput = ({ t }) => {

  const [address, setAddress] = useState("")
  const [latLng, setLatlng] = useState({ lat: 0, long: 0 });

  const handleSelect = async value => {
    try {
      const results = await geocodeByAddress(value);
      const resultLatLng = await getLatLng(results[0]);

      console.log(value);
      console.log(resuls[0]);
      console.log(resultLatLng);

      setAddress(value)
      setLatlng(resultLatLng);
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
      {
        ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          console.log(suggestions)
          return (
            <div>
              <input {...getInputProps({ placeholder: t('selectALocation') })} />

              <div>
                { loading && '...loading' }
                {
                  suggestions.map(suggestion => {
                    const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };

                    return (
                      <div {...getSuggestionItemProps(suggestions, { className, style })}>
                        {suggestion.description}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      }
      </PlacesAutocomplete>
    </div>
  );
}


// @export
export default withTranslation('common')(AutocompleteInput);