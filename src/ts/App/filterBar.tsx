import { h, Component } from 'preact';

export interface FilterBarProps {
  filter: string;
  updateFilter: (newFilter: string) => void;
  filterStatus: string;
}

interface FilterBarState {
  value: string;
  lastValue: string;
  filterStatus: string;
}

const WAIT_INTERVAL = 1500;
const ENTER_KEY = 13;

export default class FilterBar extends Component<FilterBarProps, FilterBarState> {
  timer: number;
  constructor(props) {
    super(props);

    this.state = {
      value: props.filter,
      lastValue: '',
      filterStatus: "clear"
    };
  }

  componentWillMount() {
    this.timer = null;
  }

  componentWillReceiveProps(newProps: FilterBarProps) {
    this.setState({
      value: newProps.filter,
      filterStatus: newProps.filterStatus
    });
  }

  handleChange = (event: Event) => {
    window.clearTimeout(this.timer);

    this.setState({
      value: (event.target as HTMLInputElement).value
    });

    this.timer = window.setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  handleKeyDown = (e) => {
    this.handleChange(e);
    if (e.keyCode === ENTER_KEY) {
      // Prevent calling triggerChange twice because of race condition
      window.clearTimeout(this.timer);
      this.triggerChange();
    }
  }

  triggerChange = () => {
    const { value, lastValue } = this.state;
    if (value !== lastValue) {
      this.props.updateFilter(value);
      this.setState({
        lastValue: value
      });
    }
  }

  render() {
    const { value, filterStatus } = this.state;

    return (
      <div class="one-half column">
        <input
          onKeyUp={this.handleKeyDown}
          id="filter"
          name="filter"
          type="text"
          value={value}
          class={filterStatus}
        />
      </div>
    );
  }
}