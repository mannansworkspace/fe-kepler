// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// TODO: this will move onto kepler.gl core
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Button } from "kepler.gl/components";

const propTypes = {
  onLoadRemoteMap: PropTypes.func.isRequired,
};

const InputForm = styled.div`
  flex-grow: 1;
  padding: 32px;
  background-color: ${(props) => props.theme.panelBackgroundLT};
`;

export const StyledInputLabel = styled.div`
  font-size: 11px;
  color: ${(props) => props.theme.textColorLT};
  letter-spacing: 0.2px;
  ul {
    padding-left: 12px;
  }
`;

export const StyledError = styled.div`
  color: red;
`;

export const StyledErrorDescription = styled.div`
  font-size: 14px;
`;

const Error = ({ error, url }) => (
  <StyledError>
    <StyledErrorDescription>{url}</StyledErrorDescription>
    <StyledErrorDescription>{error.message}</StyledErrorDescription>
  </StyledError>
);

const API_URL = `${process.env.REACT_APP_CUSTOM_CLOUD_PROVIDER_API_URL}/map.json`;

class LoadRemoteMap extends Component {
  state = {
    dataUrl: API_URL,
    error: null,
    submitted: false,
  };

  onLoadRemoteMap = () => {
    const { dataUrl, error } = this.state;

    this.setState({ submitted: true });

    if (!dataUrl || error) {
      return;
    }

    this.props.onLoadRemoteMap({ dataUrl });
  };

  render() {
    const displayedError =
      this.props.error || this.state.submitted ? this.state.error : null;

    return (
      <div>
        <InputForm>
          <Button type="submit" cta size="small" onClick={this.onLoadRemoteMap}>
            <FormattedMessage id={"Load local Map.json"} />
          </Button>
          {displayedError && (
            <Error error={displayedError} url={this.props.option?.dataUrl} />
          )}
        </InputForm>
      </div>
    );
  }
}

LoadRemoteMap.propTypes = propTypes;

export default LoadRemoteMap;
